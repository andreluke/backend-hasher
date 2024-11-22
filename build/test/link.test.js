import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import Link from '../models/Link';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';
dotenv.config({ path: '.env.test' });
const fakeID = new mongoose.Types.ObjectId();
jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => '123456'),
}));
jest.mock('chalk', () => ({
    green: jest.fn(),
    blue: jest.fn(),
    red: jest.fn(),
    yellow: jest.fn()
}));
describe('Testes de Integração - Rotas de Links', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI_TEST || '');
        }
    });
    afterAll(async () => {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
        }
        await mongoose.connection.close();
    });
    describe("POST /links", () => {
        it("Deve criar um novo link com uma slug personalizada", async () => {
            const response = await request(app)
                .post("/links")
                .send({ url: "http://example.com", slug: "customslug" });
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                url: "http://example.com",
                slug: "customslug",
            });
        });
        it("Deve falhar ao tentar repetir o mesmo slug", async () => {
            const response = await request(app)
                .post("/links")
                .send({ url: "http://example34.com", slug: "customslug" });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Slug já está em uso.");
        });
        it("Deve retornar uma slug nova caso nenhuma seja usada", async () => {
            const response = await request(app)
                .post("/links")
                .send({ url: "http://example.com" });
            expect(response.status).toBe(201);
            expect(response.body.slug).toHaveLength(6);
        });
        it("Deve retornar erro caso nada seja passado", async () => {
            const response = await request(app)
                .post("/links")
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBeTruthy();
        });
        it("Deve retornar erro caso seja passado um link inválido", async () => {
            const response = await request(app)
                .post("/links")
                .send({ url: "aaaaaaaa" });
            expect(response.status).toBe(400);
            expect(response.body.message).toBeTruthy();
        });
    });
    describe("GET /links", () => {
        it("Deve retornar todos os links baseados na ordem alfabética", async () => {
            await Link.create([{ url: "http://b.com", slug: "111111" }, { url: "http://a.com", slug: "222222" }]);
            const response = await request(app).get("/links");
            expect(response.status).toBe(200);
            expect(response.body[0].url).toBe("http://a.com");
            expect(response.body[1].url).toBe("http://b.com");
        });
    });
    describe("GET /links/:slug", () => {
        it("Deve redirecionar para o link caso a slug exista", async () => {
            await Link.create({ url: "http://example.com", slug: "customslug2" });
            const response = await request(app).get("/links/customslug2");
            expect(response.status).toBe(302);
            expect(response.header.location).toBe("http://example.com");
        });
        it("Deve retornar um erro 404 caso a slug não exista", async () => {
            const response = await request(app).get("/links/nonexistent");
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Link não encontrado");
        });
    });
    describe("PUT /links", () => {
        it("Deve atualizar um link pelo id", async () => {
            const link = await Link.create({
                url: "http://example.com",
                slug: "customslug3",
            });
            const response = await request(app).put("/links").send({
                id: link._id,
                url: "http://newexample.com",
            });
            expect(response.status).toBe(200);
            expect(response.body.url).toBe("http://newexample.com");
        });
        it("Deve atualizar um link pelo id", async () => {
            const link = await Link.create({
                url: "http://example33.com",
                slug: "customslug4",
            });
            const response = await request(app).put("/links").send({
                id: link._id,
                slug: "outroslug",
            });
            expect(response.status).toBe(200);
            expect(response.body.slug).toBe("outroslug");
        });
        it("Deve retornar um erro 404 caso o ID não exista", async () => {
            const response = await request(app).put("/links").send({
                id: fakeID,
                url: "http://newexample.com",
            });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Link não encontrado");
        });
        it("Deve retornar erros de validação se so dados forem incorretos", async () => {
            const response = await request(app).put("/links").send({
                id: "invalid-id",
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBeTruthy();
        });
        it("Deve retornar um erro de validação do validator", async () => {
            const link = await Link.create({
                url: "http://example.com",
                slug: "customslug5",
            });
            const response = await request(app).put("/links").send({
                id: link._id,
                url: "bbbbbbbb",
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBeTruthy();
        });
    });
    describe("DELETE /links/:id", () => {
        it("Deve deletar um link pelo ID", async () => {
            const link = await Link.create({ url: "http://example.com", slug: "333333" });
            const response = await request(app).delete(`/links/${link.id}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(link.id.toString());
        });
        it("Deve retornar um erro 404 caso o link não exista", async () => {
            const response = await request(app).delete(`/links/${fakeID}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Link não encontrado");
        });
    });
});
