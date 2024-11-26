import Link from "../models/Link.js";
import { nanoid } from "nanoid";
class LinkController {
    async create(req, res) {
        const { url, slug } = req.body;
        const customSlug = slug || nanoid(6);
        try {
            const existingLink = await Link.findOne({ slug: customSlug });
            if (existingLink) {
                return res.status(400).send({ message: "Slug já está em uso." });
            }
            const link = {
                url: url,
                slug: customSlug,
            };
            const response = await Link.create(link);
            return res.status(201).send(response);
        }
        catch (e) {
            if (e.errors) {
                const errorMessages = Object.values(e.errors).map((err) => err.message);
                return res.status(400).send({ message: errorMessages.join(". ") });
            }
            else {
                return res.status(400).send({ message: e.message });
            }
        }
    }
    async list(_, res) {
        try {
            const links = await Link.find({}, {}, { sort: { url: 1 } });
            res.status(200).send(links);
        }
        catch (e) {
            res.status(500).send({ message: e.message });
        }
    }
    async getBySlug(req, res) {
        const { slug } = req.params;
        try {
            const response = await Link.findOne({ slug });
            if (response) {
                res.status(302).redirect(response.url);
            }
            else {
                res.status(404).send({ message: "Link não encontrado" });
            }
        }
        catch (e) {
            res.status(500).send({ message: e.message });
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            const response = await Link.findByIdAndDelete(id);
            if (response) {
                res.status(200).send(response);
            }
            else {
                res.status(404).send({ message: "Link não encontrado" });
            }
        }
        catch (e) {
            res.status(400).send({ message: e.message });
        }
    }
    async update(req, res) {
        const { id, url, slug } = req.body;
        const updateData = {};
        if (url !== undefined)
            updateData.url = url;
        if (slug !== undefined)
            updateData.slug = slug;
        try {
            const response = await Link.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (response) {
                res.status(200).send(response);
            }
            else {
                res.status(404).send({ message: "Link não encontrado" });
            }
        }
        catch (e) {
            if (e.errors) {
                const errorMessages = Object.values(e.errors).map((err) => err.message);
                res.status(400).send({ message: errorMessages.join(", ") });
            }
            else {
                res.status(400).send({ message: e.message });
            }
        }
    }
}
export default new LinkController();
