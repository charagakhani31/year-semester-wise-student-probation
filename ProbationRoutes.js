import express from 'express';
const router = express.Router();
import { SQL } from "../utils/db.js";

router.get('/year', async(req, res) => {
     const year = await SQL `SELECT DISTINCT year from takes;`;
     res.status(200).json(year);
});

router.get('/semester/:year', async(req,res) => {
    const { year } = req.params;

    const semester = await SQL `SELECT DISTINCT semester FROM takes WHERE year = ${year} ORDER BY semester;`;
    res.json(semester);
});

router.get('/probation/:semester/:year', async(req, res) => {
    const { semester } = req.params;
    const { year } = req.params;

    const probation = await SQL `SELECT s.id, s.name, g.year, g.semester, ROUND(g.gpa, 2) AS gpa FROM student s
                               JOIN (
                                      SELECT
                                       t.id, t.year, t.semester,
                                             SUM(
                                                  CASE t.grade
                                                    WHEN 'A'  THEN 3.75 * c.credits
                                                    WHEN 'A-' THEN 3.5 * c.credits
                                                    WHEN 'B+' THEN 3.25 * c.credits
                                                    WHEN 'B'  THEN 3.0 * c.credits
                                                    WHEN 'B-' THEN 2.75 * c.credits 
                                                    WHEN 'C+' THEN 2.5 * c.credits
                                                    WHEN 'C'  THEN 2.0 * c.credits 
                                                    WHEN 'C-' THEN 1.5 * c.credits
                                                    WHEN 'F'  THEN 0.0 * c.credits
                                                 END) / SUM(c.credits) AS gpa FROM takes t
                                                 JOIN course c ON t.course_id = c.course_id
                                                 GROUP BY t.id, t.year, t.semester) g ON s.id = g.id
                                                 WHERE g.year = ${year} AND g.semester = ${semester} AND g.gpa < 1.75
                                                 ORDER BY s.id;`;
    res.json(probation);                       
})

export default router;
