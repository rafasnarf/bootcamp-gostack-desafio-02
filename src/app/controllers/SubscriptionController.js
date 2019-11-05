/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll();

    return res.json(subscriptions);
  }

  async store(req, res) {
    const schema = await Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }
    const subExists = await Subscription.findOne({
      where: { title: req.body.title },
    });

    if (subExists) {
      return res.status(400).json({ error: 'Plano já cadastrado' });
    }
    Subscription.create(req.body);
    return res.json(req.body);
  }
}

export default new SubscriptionController();
