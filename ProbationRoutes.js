import express from 'express';
const router = express.Router();
import { SQL } from "../utils/db.js";

router.get('/year', async(req, res) => {
     const year = await SQL `SELECT DISTINCT year From recap ORDER BY year;`;
     res.status(200).json(year);
});

router.get('/semester/:year', async(req,res) => {
    const { year } = req.params;

    const semester = await SQL `SELECT DISTINCT semester FROM recap WHERE year = ${year} ORDER BY semester;`;
    res.json(semester);
});

router.get('/probation/:semester/:year', async(req, res) => {
    const { semester } = req.params;
    const { year } = req.params;

    const probation = await SQL `SELECT t.regno, s.name, t.year, t.semester, 
                                ROUND(SUM(t.gpa * t.credits) / SUM(t.credits),2) AS semester_gpa
                                FROM ( 
                                SELECT c.regno, c.rid, r.year, r.semester, (co.theory + co.lab) AS credits, g.gpa
                                FROM cmarks c JOIN recap r ON c.rid = r.rid 
                                JOIN course co ON r.cid = co.cid 
                                JOIN grade g ON c.marks BETWEEN g.start AND g.end
                                WHERE c.hid = 246 AND r.year = ${year} AND r.semester = ${semester}) t
                                JOIN student s ON t.regno = s.regno
                                GROUP BY t.regno, s.name, t.year, t.semester
                                HAVING ROUND( SUM(t.gpa * t.credits) / SUM(t.credits),2 ) < 1.75;`;
    res.json(probation);                       
})

export default router;
