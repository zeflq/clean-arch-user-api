import cors from "cors";

const enableCors = () => {
  const corsOptions: cors.CorsOptions = {
    // cette méthode vérifie si le serveur à l'origine de la requete est dans la liste configurée
    origin: (origin, callback) => {
      const corsWhitelist = process.env.corsWhitelist
        ? process.env.corsWhitelist.split(",")
        : [];
      let originIsWhitelisted = false;
      const originIsInWhitelist = corsWhitelist.some((item) => {
        return item.startsWith("/") && item.endsWith("/")
          ? new RegExp(".*" + item.slice(1, -1) + ".*").test(origin || "")
          : item === origin;
      });

      if (originIsInWhitelist) {
        originIsWhitelisted = true;
      }
      callback(null, originIsWhitelisted);
    },
  };

  return cors(corsOptions);
};

export default enableCors;
