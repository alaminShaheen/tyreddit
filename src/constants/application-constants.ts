import * as dotenv from "dotenv";

dotenv.config();

export const ApplicationConstants = {
	__prod__: process.env.NODE === "production",
	port: process.env.APP_PORT,
};
