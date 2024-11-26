interface createLink {
  Body: { url: string; slug?: string };
}

interface getSlug {
  Params: { slug: string };
}

interface deleteLink {
  Params: { id: string };
}

interface updateLink {
  Body: {
    id: string;
    url: string;
    slug: string;
  };
}

export {
    createLink,
    getSlug,
    deleteLink,
    updateLink
}