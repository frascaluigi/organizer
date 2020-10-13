import { validate } from "class-validator";
import { addDays, startOfDay, startOfWeek, compareDesc, endOfWeek } from 'date-fns';
import { NextFunction, Request, Response } from "express";
import { getRepository, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { Event } from "../entities/Event";
import ErrorCustom, { StatusCode } from "../helpers/ErrorCustom";

const DEFAULT_PERIOD = 7;

class EventController{

    private static getEventById = async (req:Request, res:Response):Promise<Event> => {
        const eventId = req.params.id;
        const userId = res.locals.tokenPayload?.userId;
        if(!userId) throw new ErrorCustom(StatusCode.Unauthorized, 'unhautorized');
        const event = await getRepository(Event).findOne({
            where:{
                user: userId, 
                id: eventId
            }
        });
        if(!event) throw new ErrorCustom(StatusCode.NotFound,'event not found');
        return event;
    }

    static getEventByIdResponse = async (req:Request, res:Response, next:NextFunction) => {
        try{
            const event = await EventController.getEventById(req, res);
            res.status(StatusCode.Ok).send({event});
        }catch(error){
            next(error)
        }
    }

    static getEventByPeriodResponse = async (req:Request, res:Response) => {
        const period = !isNaN(parseInt(req.params.period)) ? parseInt(req.params.period) : DEFAULT_PERIOD;
        const userId = res.locals.tokenPayload?.userId;
        if(!userId) throw new ErrorCustom(StatusCode.Unauthorized, 'unhautorized');
        //next seven (or another period) days 
        const events = await getRepository(Event).find({
            where:{
                user: userId,
                start: MoreThanOrEqual(startOfDay(new Date())),
                end: LessThanOrEqual(addDays(new Date(), period))
            }
        })

        res.status(StatusCode.Ok).send({events});
    }

    static getEventByWeekResponse = async (req:Request, res:Response) => {
        const userId = res.locals.tokenPayload?.userId;
        if(!userId) throw new ErrorCustom(StatusCode.Unauthorized, 'unhautorized');

        const today = new Date();
        const startWeek = startOfWeek(today);
        const endWeek = endOfWeek(today);
        
        //events in week
        const events = await getRepository(Event).find({
            where:{
                user: userId,
                start: MoreThanOrEqual(startWeek),
                end: LessThanOrEqual(endWeek)
            }
        })

        res.status(StatusCode.Ok).send({events});
    }

    private static createEvent = async (req:Request, res:Response):Promise<Event> => {
        const userId = res.locals.tokenPayload?.userId;
        if(!userId) throw new ErrorCustom(StatusCode.Unauthorized, 'unhautorized');

        const {name, address, start, end} = req.body;
        const event = new Event();
        event.name = name;
        event.address = address;

        //check date
        const checkDate = compareDesc(new Date(start), new Date(end))
        console.log("checkDate: ", checkDate);
        if(checkDate < 0) throw new ErrorCustom(StatusCode.BadRequest, 'end date must be greater than start date');
        event.start = start;
        event.end = end;
        
        event.user = res.locals.tokenPayload?.userId;
        
        const eventCreated = await getRepository(Event).save(event);
        return eventCreated;
    }

    static createEventResponse = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const newEvent = await EventController.createEvent(req, res);
            res.status(StatusCode.Created).send({id: newEvent.id});
        } catch (error) {
            next(error);
        }
    }

    private static updateEvent = async (req:Request, res:Response):Promise<Event> => {
        const eventId = req.params.id;
        if(!eventId) throw new ErrorCustom(StatusCode.BadRequest, 'event id is required');
        const partialEvent: any = {...req.body, id: eventId};
        const eventToUpdate = await getRepository(Event).preload(partialEvent);
        if(!eventToUpdate) throw new ErrorCustom(StatusCode.NotFound, 'event id not found');

        const errors = await validate(eventToUpdate);
        errors && errors.length && console.error("validation errors: ", JSON.stringify(errors, null, 4));
        if (errors.length > 0) throw new ErrorCustom(StatusCode.BadRequest, `event fields not valid`);
        return getRepository(Event).save(eventToUpdate);
    }

    static updateEventResponse = async (req:Request, res:Response, next:NextFunction) => {
        try {
            await EventController.updateEvent(req, res);
            res.status(StatusCode.NoContent).send();    
        } catch (error) {
            next(error);
        }
    }

    private static deleteEventById = async (req:Request, res:Response) => {
        const eventId = req.params.id;
        if(!eventId) throw new ErrorCustom(StatusCode.BadRequest, 'event id is required');
        await getRepository(Event).delete({id:eventId});
    }

    static deleteEventByIdResponse = async (req:Request, res:Response, next:NextFunction) => {
        try{
            await EventController.deleteEventById(req, res);
            res.status(StatusCode.NoContent).send();
        }catch(error){
            next(error);
        }
    }
}

export default EventController;