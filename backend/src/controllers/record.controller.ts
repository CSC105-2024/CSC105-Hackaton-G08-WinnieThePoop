import * as RecordModel from '../models/record.model.ts';
import type { Context } from 'hono';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const createRecordController = async (c: Context) => {
    const body = await c.req.json();
    const user = c.get('user') as { id: number };
    
    try {
        const record = await RecordModel.createRecord({
            UserId: user.id,
            RecordName: body.RecordName,
            RecordDescription: body.RecordDescription,
            RecordColor: body.RecordColor,
            RecordDate: body.RecordDate,
            RecordStatus: body.RecordStatus,
        });
    
        return c.json({ message: 'Record created successfully', record });
    } catch (err) {
        console.error(err);
        return c.json({ error: 'Failed to create record' }, 500);
    }
};

export const updateRecordController = async (c: Context) => {
    try {
        const updatedRecord = await RecordModel.updateRecord(c);
    
        return c.json({ message: 'Record updated successfully', updatedRecord });
    } catch (err) {
        console.error('Error updating record:', err);
        return c.json({ error: 'Failed to update record' }, 500);
    }
};

export const deleteRecordController = async (c: Context) => {
    try {
        await RecordModel.deleteRecord(c); 
         return c.json({ message: 'Record deleted successfully' });    
    
    } catch (err) {
        console.error('Error deleting record:', err);
        return c.json({ error: 'Failed to delete record' }, 500);
    }
};

export const fetchRecordsController = async (c: Context) => {
  const user = c.get('user') as { id: number };

  try {
    const records = await RecordModel.fetchRecords(user.id);
    return c.json({ message: 'Records fetched successfully', records });
  } catch (err) {
    console.error('Error fetching records:', err);
    return c.json({ error: 'Failed to fetch records' }, 500);
  }
};




