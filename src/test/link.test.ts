import request from 'supertest';
import app from '../index'; 
import mongoose from 'mongoose';
import Link from '../models/Link';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

dotenv.config({ path: '.env.test' });

const fakeID = new mongoose.Types.ObjectId()
let usuarioId: string;
let authToken: string;
let generalAuthToken: string;
let alimentoId: string;
let dietaAuthId: string;
let alimentoId1: string;
let alimentoId2: string;
let dietaId: string;
let dietaDiariaId: string;


const createAndLogin = async (): Promise<string> => {
  const existingUser = await mongoose.model('Usuario').findOne({ email: 'roberto@gmail.com' });
  if (!existingUser) {
    await request(app.server).post('/api/user').send({
      nome: 'Lucas',
      email: 'roberto@gmail.com',
      senha: '123123',
    });
  }

  // Realiza o login para obter o token de autenticação
  const loginResponse = await request(app.server).post('/api/auth/login').send({
    email: 'roberto@gmail.com',
    senha: '123123',
  });

  const authToken = loginResponse.body.token;
  return authToken;
};

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => '123456'), 
}));

jest.mock('chalk', () => ({
  green: (msg: string) => msg,
  blue: (msg: string) => msg,
  red: (msg: string) => msg,
  yellow: (msg: string) => msg,
  underline: (msg: string) => msg,
  bgYellow: (msg: string) => msg,
  bold: (msg: string) => msg,
}));

jest.mock('consola', () => ({
  log: (msg:string) => console.log(msg)
}))

describe('Testes de Integração', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || '');
    }

    const existingUser = await mongoose.model('Usuario').findOne({ email: 'sales@gmail.com' });
    if (!existingUser) {
      await request(app.server).post('/api/user').send({
        nome: 'André',
        email: 'sales@gmail.com',
        senha: '123123',
      });
    }

    const loginResponse = await request(app.server).post("/auth/login").send({
      email: "sales@gmail.com",
      senha: "123123",
    });
  
    generalAuthToken = loginResponse.body.token;
  });

  afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
    await mongoose.connection.close();
  });
 
  describe("Rotas de usuários (/api/user)", () => {
    it("POST /user", async () => {
      const start = Date.now(); // Inicia a medição de tempo

      const response = await request(app.server).post("/api/user").send({
        nome: "André",
        email: "andre@gmail.com",
        senha: "123123",
      });

      const end = Date.now(); 
      const duration = end - start; 

      expect(duration).toBeLessThan(500); 

      // Valida o conteúdo da resposta
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("usuario");
      expect(response.body.usuario.email).toBe("andre@gmail.com");

      usuarioId = response.body.usuario._id;
    })

    it("Deve fazer login e retornar um token", async () => {
      const loginResponse = await request(app.server).post("/api/auth/login").send({
        email: "andre@gmail.com",
        senha: "123123",
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty("token");

      authToken = loginResponse.body.token;
    });
  })

  describe("Rotas de links (/api/links)", () => {
    describe("POST /links", () => {
      it("Deve criar um novo link com uma slug personalizada", async () => {
        const response = await request(app.server)
          .post("/api/links")
          .send({ url: "http://example.com", slug: "customslug" }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          url: "http://example.com",
          slug: "customslug",
        });
      });
  
      it("Deve falhar ao tentar repetir o mesmo slug", async () => {
        const response = await request(app.server)
          .post("/api/links")
          .send({ url: "http://example34.com", slug: "customslug" }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Slug já está em uso.")
      });
  
      it("Deve retornar uma slug nova caso nenhuma seja usada", async () => {
        const response = await request(app.server)
          .post("/api/links")
          .send({ url: "http://example.com" }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(201);
        expect(response.body.slug).toHaveLength(6); 
      });
  
      it("Deve retornar erro caso nada seja passado", async () => {
        const response = await request(app.server)
          .post("/api/links")
          .send({}).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBeTruthy();
      });
  
      it("Deve retornar erro caso seja passado um link inválido", async () => {
        const response = await request(app.server)
          .post("/api/links")
          .send({ url: "aaaaaaaa"}).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBeTruthy();
      });
    });
  
    describe("GET /links", () => {
      it("Deve retornar todos os links baseados na ordem alfabética", async () => {
        await Link.create([{ url: "http://b.com", slug: "111111" }, { url: "http://a.com", slug: "222222" }]);
  
        const response = await request(app.server).get("/api/links");
  
        expect(response.status).toBe(200);
        expect(response.body[0].url).toBe("http://a.com");
        expect(response.body[1].url).toBe("http://b.com");
      });
    });
  
    describe("GET /links/:slug", () => {
      it("Deve redirecionar para o link caso a slug exista", async () => {
        await Link.create({ url: "http://example.com", slug: "customslug2" });
  
        const response = await request(app.server).get("/api/links/customslug2");
  
        expect(response.status).toBe(302);
        expect(response.header.location).toBe("http://example.com");
      });
  
      it("Deve retornar um erro 404 caso a slug não exista", async () => {
        const response = await request(app.server).get("/api/links/nonexistent");
  
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
  
        const response = await request(app.server).put("/api/links").send({
          id: link._id,
          url: "http://newexample.com",
        }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(200);
        expect(response.body.url).toBe("http://newexample.com");
      });
  
      it("Deve atualizar um link pelo id", async () => {
        const link = await Link.create({
          url: "http://example33.com",
          slug: "customslug4",
        });
  
        const response = await request(app.server).put("/api/links").send({
          id: link._id,
          slug: "outroslug",
        }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(200);
        expect(response.body.slug).toBe("outroslug");
      });
  
      it("Deve retornar um erro 404 caso o ID não exista", async () => {
        const response = await request(app.server).put("/api/links").send({
          id: fakeID,
          url: "http://newexample.com",
        }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Link não encontrado");
      });
  
      it("Deve retornar erros de validação se so dados forem incorretos", async () => {
        const response = await request(app.server).put("/api/links").send({
          id: "invalid-id",
        }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBeTruthy();
      });
  
      it("Deve retornar um erro de validação do validator", async () => {
        const link = await Link.create({
          url: "http://example.com",
          slug: "customslug5",
        });
  
        const response = await request(app.server).put("/api/links").send({
          id: link._id,
          url: "bbbbbbbb",
        }).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBeTruthy();
      });
    });
  
    describe("DELETE /links/:id", () => {
      it("Deve deletar um link pelo ID", async () => {
        const link = await Link.create({ url: "http://example.com", slug: "333333" });
  
        const response = await request(app.server).delete(`/api/links/${link.id}`).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(link.id.toString());
      });
  
      it("Deve retornar um erro 404 caso o link não exista", async () => {
        const response = await request(app.server).delete(`/api/links/${fakeID}`).set("Authorization", `${authToken}`);
  
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Link não encontrado");
      });
    });
  })
});