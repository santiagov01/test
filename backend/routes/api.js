import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/equipos-proximos", (req, res) => {
  const sql = `
    SELECT pm.fecha_proxima, ft.nombre_equipo, ce.componente_equipo, pm.nombre_plan
    FROM programacion_mantenimiento pm
    JOIN ficha_tecnica ft ON pm.nombre_equipo = ft.nombre_equipo
    JOIN planes_mantenimiento pl ON pm.nombre_plan = pl.nombre_plan
    JOIN componentes_equipos ce ON pl.componente_equipo = ce.componente_equipo
    WHERE pm.fecha_proxima >= CURDATE()
    ORDER BY pm.fecha_proxima ASC;
  `;
  db.query(sql, (err, result) => err ? res.status(500).send(err) : res.json(result));
});

router.get("/costos", (req, res) => {
  const { start, end } = req.query;
  const sql = `
    SELECT ft.nombre_equipo, SUM(pl.costo) AS total_costo
    FROM planes_mantenimiento pl
    JOIN ficha_tecnica ft ON pl.nombre_equipo = ft.nombre_equipo
    JOIN orden_trabajo ot ON ot.nombre_plan = pl.nombre_plan
    WHERE ot.fecha_orden BETWEEN ? AND ?
    GROUP BY ft.nombre_equipo
    ORDER BY total_costo DESC;
  `;
  db.query(sql, [start, end], (err, result) => err ? res.status(500).send(err) : res.json(result));
});

router.get("/alertas", (req, res) => {
  const sql = `
    SELECT nombre_equipo, presion, temperatura, nivel, amperaje
    FROM orden_trabajo
    WHERE presion > 100 OR temperatura > 90 OR nivel > 80 OR amperaje > 50;
  `;
  db.query(sql, (err, result) => err ? res.status(500).send(err) : res.json(result));
});

router.get("/ordenes", (req, res) => {
  const { start, end, estado } = req.query;
  const sql = `
    SELECT * FROM orden_trabajo
    WHERE fecha_orden BETWEEN ? AND ?
    ${estado ? "AND estado = ?" : ""};
  `;
  const params = estado ? [start, end, estado] : [start, end];
  db.query(sql, params, (err, result) => err ? res.status(500).send(err) : res.json(result));
});

router.get("/mttr", (req, res) => {
  const sql = `
    SELECT nombre_equipo,
           SUM(tiempo_ejecucion) / COUNT(*) AS MTTR
    FROM orden_trabajo
    WHERE tipo_falla IS NOT NULL
    GROUP BY nombre_equipo;
  `;
  db.query(sql, (err, result) => err ? res.status(500).send(err) : res.json(result));
});

router.get("/mtbf", (req, res) => {
  const sql = `
    SELECT nombre_equipo,
           (160 / COUNT(*)) AS MTBF
    FROM orden_trabajo
    WHERE tipo_falla IS NOT NULL
    GROUP BY nombre_equipo;
  `;
  db.query(sql, (err, result) => err ? res.status(500).send(err) : res.json(result));
});

export default router;
