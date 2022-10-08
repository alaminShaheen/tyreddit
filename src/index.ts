import { Database } from "./database/database";

async function main() {
	try {
		const databaseInstance = new Database();
		await databaseInstance.init();
	} catch (error) {
		console.log(error);
	}
}

void main();
