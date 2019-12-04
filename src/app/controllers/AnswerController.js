/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import { parseISO } from 'date-fns';

import { parse } from 'uri-js';
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';
import AnswerMail from '../jobs/answerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const orders = await HelpOrders.findAll({
      where: { answer_at: null, answer: null },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(orders);
  }

  async store(req, res) {
    const answerExists = await HelpOrders.findOne(
      { where: { id: req.params.id } },
      {
        include: [
          {
            model: HelpOrders,
            attributes: ['id', 'question', 'student_id', 'answer', 'answer_at'],
          },
        ],
      }
    );
    if (!answerExists) {
      return res
        .status(400)
        .json({ error: 'Solicitação de auxílio não encontrada' });
    }
    const studentExists = await Student.findOne(
      {
        where: { id: answerExists.student_id },
      },
      {
        include: [
          {
            model: Student,
            as: 'student_id',
            attributes: ['name', 'email'],
          },
        ],
      }
    );
    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não cadastrado' });
    }
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }

    const { answer } = req.body;
    const answerDate = new Date();
    const parsedDate = parseISO(answerDate);
    const validAnswer = await HelpOrders.update(
      { answer, answer_at: answerDate },
      { where: { id: req.params.id } }
    );

    await Queue.add(AnswerMail.key, {
      answerExists,
      studentExists,
      answerDate,
      answer,
    });
    return res.json(validAnswer);
  }
}
export default new AnswerController();
