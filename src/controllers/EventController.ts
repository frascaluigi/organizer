import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Event } from "../entities/Event";

class EventController{

    private static getEventById = async (req:Request, res:Response):Promise<Event> => {
        const eventId = req.params.id;
        const event = await getRepository(Event).findOne({id:eventId});
        if(!event) throw new Error('event not found');
        return event;
    }

    static getEventByIdResponse = async (req:Request, res:Response) => {
        try{
            const event = await EventController.getEventById(req, res);
            res.status(200).send({event});
        }catch(error){
            console.error("something went wrong while retrieve information event");
            res.status(404).send('not found');
        }
    }

    static getEventByPeriodResponse = async (req:Request, res:Response) => {
        console.log("get event by period");
        res.status(200).send()
    }

    private static createEvent = async (req:Request, res:Response):Promise<Event> => {
        const {name, address, start, end} = req.body;

        const event = new Event();
        event.name = name;
        event.address = address;
        event.start = start;
        event.end = end;
        event.user = res.locals.tokenPayload?.userId;
        
        const eventCreated = await getRepository(Event).save(event);
        return eventCreated;
    }

    static createEventResponse = async (req:Request, res:Response) => {
        const tokenPayload = res.locals.tokenPayload;
        if(!tokenPayload.userId){
            //throw error
        }
        try {
            const newEvent = await EventController.createEvent(req, res);
            res.status(201).send({id: newEvent.id});
        } catch (error) {
            res.status(400).send('bad request');
        }
    }

    static updateEventResponse = async (req:Request, res:Response) => {
        console.log("update event by id");
        res.status(204).send();
    }

    private static deleteEventById = async (req:Request, res:Response) => {
        const eventId = req.params.id;
        await getRepository(Event).delete({id:eventId});
    }

    static deleteEventByIdResponse = async (req:Request, res:Response) => {
        try{
            await EventController.deleteEventById(req, res);
            res.status(204).send();
        }catch(error){
            console.error("something went wrong while delete information event: ", error);
            res.status(404).send('not found');
        }
    }
}

export default EventController;