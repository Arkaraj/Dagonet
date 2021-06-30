import { connect } from "mongoose";

(function () {
  connect(
    `${process.env.MONGO_URI}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Successfully Connected to Database!");
      }
    }
  );
})();
