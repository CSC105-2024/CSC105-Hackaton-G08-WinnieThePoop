import type { Context } from "hono";
import { PrismaClient, type RecordColor, type RecordStatus } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const createRecord = async (RecordData: {
  UserId: number;
  RecordName?: string;
  RecordDescription?: string;
  RecordColor: RecordColor;
  RecordDate: Date;
  RecordStatus: RecordStatus;
}) => {
  const recordCount = await prisma.record.count({
    where: {
      UserId: RecordData.UserId
    }
  });
  const defaultName = `Record ${String(recordCount + 1).padStart(2, '0')}`;
  const DataToInsert = {
    RecordName: RecordData.RecordName ?? defaultName,
    RecordDescription: RecordData.RecordDescription ?? '',
    RecordColor: RecordData.RecordColor ?? 'Brown',
    RecordDate: RecordData.RecordDate ?? new Date(),
    RecordStatus: RecordData.RecordStatus,
    User: {
      connect: {
        UserId: RecordData.UserId,
      },
    },
  };

  const record = await prisma.record.create({
    data: DataToInsert,
  });

  return record;
};

export const updateRecord = async (c: Context) => {
  const id = Number(c.req.param('id'));
  const user = c.get('user') as { id: number };
  const body = await c.req.json();

  try {
    await prisma.record.updateMany({
      where: {
        RecordId: id,
        UserId: user.id
      },
      data: {
        RecordName: body.RecordName ?? 'My Record',
        RecordDescription: body.RecordDescription ?? '',
        RecordColor: body.RecordColor ?? 'Brown',
        RecordDate: body.RecordDate ?? new Date(),
      }
    });

    return c.json({ message: 'Record updated successfully' });
  } catch (err) {
    console.error('Error updating Record:', err);
    return c.json({ error: 'Failed to update Record' }, 500);
  }
};

export const deleteRecord = async (c: Context) => {
  const id = Number(c.req.param('id'));
  const user = c.get('user') as { id: number };

  try {

    await prisma.record.deleteMany({
      where: {
        RecordId: id,
        UserId: user.id
      }
    });

    return c.json({ message: 'Record deleted successfully' });
  } catch (error) {
        console.error('Error deleting Record:', error);
    return c.json({ error: 'Failed to delete Record' }, 500);
  }
};

export const fetchRecords = async (userid: number) => {
  try {
    const records = await prisma.record.findMany({
      where: {
        UserId: userid, 
      },
      orderBy: {
        RecordDate: 'desc',
      },
    });

    return records; 
  } catch (error) {
    console.error('Error fetching Records:', error);
    throw new Error('Failed to fetch Records');
  }
};


export const fetchRecordCount = async (c: Context) => {
    const user = c.get('user') as { id: number };
    
    try {
        const count = await prisma.record.count({
        where: {
            UserId: user.id
        }
        });
    
        return c.json({ count });
    } catch (error) {
        console.error('Error fetching Record count:', error);
        return c.json({ error: 'Failed to fetch Record count' }, 500);
    }
}

export const fetchRecordByDate = async (c: Context) => {
  const user = c.get('user') as { id: number };
  const dateParam = c.req.param('date'); // Expected format: "YYYY-MM-DD"

  try {
    const baseDate = new Date(`${dateParam}T00:00:00+07:00`);
    const startOfDay = new Date(baseDate);
    const endOfDay = new Date(baseDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const records = await prisma.record.findMany({
      where: {
        UserId: user.id,
        RecordDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        RecordDate: 'desc',
      },
    });

    return c.json(records);
  } catch (error) {
    console.error('Error fetching Records by date:', error);
    return c.json({ error: 'Failed to fetch Records by date' }, 500);
  }
};
