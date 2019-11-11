/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import { addDays, startOfDay, parseISO } from 'date-fns';
import Registrations from '../models/Registration';

import Subscription from '../models/Subscription';
import Student from '../models/Student';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      subscription_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }

    const { subscription_id, student_id, start_date } = req.body;
    const subExists = await Subscription.findOne({
      where: { id: subscription_id },
    });
    if (!subExists) {
      return res.status(400).json({ error: 'Não existe esse tipo de plano' });
    }
    const studentExists = await Student.findOne(
      { where: { id: student_id } },
      {
        include: [
          {
            model: Student,
            as: 'student_id',
            attributes: ['name', 'email', 'hasplan'],
          },
        ],
      }
    );
    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não cadastrado' });
    }
    const regExists = await Student.findOne({
      where: { id: student_id, hasplan: true },
    });
    if (regExists) {
      return res
        .status(400)
        .json({ error: 'Aluno já possui plano, selecione alteração de plano' });
    }
    const subscriptions = await Subscription.findOne(
      { where: { id: subscription_id } },
      {
        include: [
          {
            model: Subscription,
            as: 'subscription_id',
            attributes: ['id', 'title', 'duration', 'price'],
          },
        ],
      }
    );
    const parsedDate = parseISO(start_date);
    const endDate = addDays(startOfDay(parsedDate), 30);
    const totalprice = parseFloat(subscriptions.price * subscriptions.duration);
    await Student.update({ hasplan: true }, { where: { id: student_id } });
    const registration = await Registrations.create({
      start_date: parsedDate,
      end_date: endDate,
      totalprice,
      student_id,
      subscription_id,
    });

    return res.json(registration);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const registrations = await Registrations.findAll({
      order: ['id'],
      attributes: ['id', 'start_date', 'end_date', 'totalprice'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      subscription_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }
    const { student_id, subscription_id, start_date } = req.body;
    const studentExists = await Student.findOne({
      where: { id: student_id },
    });
    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não existe' });
    }
    const subExists = await Subscription.findOne({
      where: { id: subscription_id },
    });
    if (!subExists) {
      return res.status(400).json({ error: 'Plano escolhido inexistente' });
    }
    const subscriptions = await Subscription.findOne(
      { where: { id: subscription_id } },
      {
        include: [
          {
            model: Subscription,
            as: 'subscription_id',
            attributes: ['id', 'title', 'duration', 'price'],
          },
        ],
      }
    );
    const parsedDate = parseISO(start_date);
    const endDate = addDays(startOfDay(parsedDate), 30);
    const totalprice = parseFloat(subscriptions.price * subscriptions.duration);
    const updating = await Registrations.update(
      {
        start_date: parsedDate,
        end_date: endDate,
        totalprice,
        student_id,
        subscription_id,
      },
      { where: { id: req.params.id } }
    );
    return res.json(updating);
  }

  async delete(req, res) {
    const checkRegExists = await Registrations.findOne({
      where: { id: req.params.id },
    });
    if (!checkRegExists) {
      return res.status(400).json({ error: 'Esta matrícula não existe' });
    }
    await Student.update(
      { hasplan: false },
      { where: { id: req.body.student_id } }
    );
    await Registrations.destroy({ where: { id: req.params.id } });

    return res.json({ message: 'Plano removido do sistema' });
  }
}
export default new RegistrationController();
