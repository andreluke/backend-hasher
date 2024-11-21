import { Request, Response } from "express";
import Link from "../models/Link";
import { nanoid } from "nanoid";
import { ILink } from "../interfaces/ILink";

class LinkController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { url, slug } = req.body;

    const customSlug = slug || nanoid(6);

    try {
      const existingLink = await Link.findOne({ slug: customSlug });
      if (existingLink) {
        return res.status(400).send({ message: "Slug já está em uso." });
      }

      const link: ILink = {
        url: url,
        slug: customSlug,
      };

      const response = await Link.create(link);
      return res.status(201).send(response);
    } catch (e: any) {
      if (e.errors) {
        const errorMessages = Object.values(e.errors).map(
          (err: any) => err.message
        );
        return res.status(400).send({ message: errorMessages.join(". ") });
      } else {
        return res.status(400).send({ message: e.message });
      }
    }
  }

  public async list(_: Request, res: Response): Promise<void> {
    try {
      const Links = await Link.find({}, {}, { sort: { url: 1 } });
      res.status(200).send(Links);
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  }

  public async getBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;
    try {
      const response = await Link.findOne({ slug });
      if (response) {
        res.status(302).redirect(response.url);
      } else {
        res.status(404).send({ message: "Link não encontrado" });
      }
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const response = await Link.findByIdAndDelete(id);
      if (response) {
        res.status(200).send(response);
      } else {
        res.status(404).send({ message: "Link não encontrado" });
      }
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id, url, slug } = req.body;

    const updateData: Record<string, any> = {};

    if (url !== undefined) updateData.url = url;
    if (slug !== undefined) updateData.slug = slug;

    try {
      const response = await Link.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (response) {
        res.status(200).send(response);
      } else {
        res.status(404).send({ message: "Link não encontrado" });
      }
    } catch (e: any) {
      if (e.errors) {
        const errorMessages = Object.values(e.errors).map(
          (err: any) => err.message
        );
        res.status(400).send({ message: errorMessages.join(", ") });
      } else {
        res.status(400).send({ message: e.message });
      }
    }
  }
}

export default new LinkController();
