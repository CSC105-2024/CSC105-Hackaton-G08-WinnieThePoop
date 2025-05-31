import type { Context } from "hono";
import { PrismaClient, RecordTexture, type RecordColor, type RecordStatus } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const createRecord = async (RecordData: {
  UserId: number;
  RecordName?: string;
  RecordDescription?: string;
  RecordColor: RecordColor;
  RecordTexture: RecordTexture;
  RecordDate: Date;
  RecordStatus?: RecordStatus;
}) => {
  const recordCount = await prisma.record.count({
    where: {
      UserId: RecordData.UserId,
    },
  });

  const defaultName = `Record ${String(recordCount + 1).padStart(2, '0')}`;

  const abnormalColors = ['Red', 'Black', 'Gray'];
  const abnormalTextures = ['Mushy', 'Liquid', 'HardLump'];
  const worrisomeTextures = ['SoftBlob'];
  let status = RecordData.RecordStatus ?? 'Normal';

  if (
    abnormalColors.includes(RecordData.RecordColor) ||
    abnormalTextures.includes(RecordData.RecordTexture)
  ) {
    status = 'Abnormal';
  }
  else if(
    worrisomeTextures.includes(RecordData.RecordTexture)
  ){
    status = 'Worrisome';
  }
  else{
    status = 'Normal';
  }

  const DataToInsert = {
    RecordName: RecordData.RecordName ?? defaultName,
    RecordDescription: RecordData.RecordDescription ?? '',
    RecordColor: RecordData.RecordColor ?? 'Brown',
    RecordTexture: RecordData.RecordTexture ?? 'Sausage',
    RecordDate: RecordData.RecordDate ?? new Date(),
    RecordStatus: status,
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

  const abnormalColors = ['Red', 'Black', 'Gray'];
  const abnormalTextures = ['Mushy', 'Liquid'];
  const worrisomeTextures = ['SoftBlob'];
  let status = body.RecordStatus ?? undefined;

  if (
    (body.RecordColor && abnormalColors.includes(body.RecordColor)) ||
    (body.RecordTexture && abnormalTextures.includes(body.RecordTexture))
  ) {
    status = 'Abnormal';
  } else if(
    body.RecordTexture && worrisomeTextures.includes(body.RecordTexture)
  ){
    status = 'Worrisome';
  }
  else{
    status = 'Normal';
  }

  try {

    const updatedRecord = await prisma.record.update({
      where: {
        RecordId: id,
      },
      data: {
        RecordName: body.RecordName ?? 'My Record',
        RecordDescription: body.RecordDescription ?? '',
        RecordColor: body.RecordColor ?? 'Brown',
        RecordTexture: body.RecordTexture ?? 'Sausage',
        RecordDate: body.RecordDate ?? new Date(),
        RecordStatus: status,
        UserId: user.id, 
      },
    });


    if (updatedRecord.UserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    return updatedRecord;  
  } catch (err) {
    console.error('Error updating Record:', err);
    throw err;  
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

export const fetchRecordCount = async (userid: number) => {
    const user = { id: userid }; 
    try {
        const count = await prisma.record.count({
        where: {
            UserId: user.id
        }
        });
    
        return count
    } catch (error) {
        console.error('Error fetching Record count:', error);
        throw new Error('Failed to fetch Record count');
    }
}

export const fetchRecordCountByDate = async (userid: number, dateParam: string) => {
  try {
    const baseDate = new Date(`${dateParam}T00:00:00+07:00`);
    const startOfDay = new Date(baseDate);
    const endOfDay = new Date(baseDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const count = await prisma.record.count({
      where: {
        UserId: userid,
        RecordDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    return count;
  } catch (error) {
    console.error('Error fetching Record count by date:', error);
    throw error;
  }
};
