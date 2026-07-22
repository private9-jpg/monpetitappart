const config = {
  schema: "./prisma/schema.prisma",
  seed: {
    run: "tsx prisma/seed.ts",
  },
};

export default config;
