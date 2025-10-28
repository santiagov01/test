import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tu_contraseña",
  database: "mantenimiento_equipos"
});

db.connect(err => {
  if (err) console.error("❌ Error al conectar con la base de datos:", err);
  else console.log("✅ Conectado a la base de datos MySQL");
});
