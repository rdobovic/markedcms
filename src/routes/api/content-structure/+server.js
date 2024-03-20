import z from 'zod';
import db from '$db';

const headers = {
    'Content-Type': 'application/json',
}

const errorResponse = (errors, status = 400) => {
    return new Response(JSON.stringify({
        status: 'error',
        errors: errors,
    }), { status, headers });
}

// /api/content-structure

export async function PUT({ request }) {
    const Op = db.Sequelize.Op;
    const commands = await request.json();

    const Commands = z.object({
        id: z
            .number({
                required_error: 'Content id is required',
                message: 'Content id must be a number',
            })
            .int({ message: 'Content id must be an integer' })
            .positive({ message: 'Content id must be positive' }),
        name: z
            .enum([ 'move', 'display' ], { 
                required_error: 'Command name is required',
                message: 'Allowed commands are move and display'
            }),
        move: z
            .number({ message: 'move property must be a number' })
            .int({ message: 'move property must be an integer' })
            .optional(),
        state: z
            .boolean({ message: 'state property must be a boolean' })
            .optional(),
    })
        .refine((data) =>
            !(data.name === 'move' && typeof(move) !== 'undefined')
        ,{
            path: [ 'move' ],
            message: 'move parameter is required for command move'
        })
        .refine((data) => 
            !(data.name === 'display' && typeof(state) !== 'undefined')
        ,{
            path: [ 'state' ],
            message: 'state parameter is required for command display'
        })
        .array();

    const headers = {
        'Content-Type': 'application/json',
    };

    let parsed;

    try {
        parsed = Commands.parse(commands);
    } catch (err) {
        return errorResponse(err.flatten().fieldErrors)
    }

    const transaction = await db.sequelize.transaction();

    for (const [ index, command ] of parsed.entries()) {

        const content = await db.Content.findByPk(command.id, { transaction });

        if (!content) {
            await transaction.rollback();
            return errorResponse(
                { [index]: 'Given content is not found' }, 404
            );
        }

        if (command.name === 'move') {
            if (command.move > 0) {
                const highest = await db.Content.findOne({
                    transaction,
                    order: [[ 'orderField', 'DESC' ]],
                    where: {
                        parentId: content.parentId,
                        rootCategoryId: content.rootCategoryId,
                    }
                });

                if (highest.orderField < content.orderField + command.move) {
                    await transaction.rollback();
                    return errorResponse(
                        { [index]: 'Invalid move property for given content' }
                    );
                }

                await db.Content.update(
                    { orderField: db.sequelize.literal(`orderField - 1`) }, {
                        transaction,
                        where: {
                            parentId: content.parentId,
                            rootCategoryId: content.rootCategoryId,
                            orderField: {
                                [Op.gt]: content.orderField,
                                [Op.lte]: content.orderField + command.move,
                            }
                        }
                });

                content.orderField += command.move;
                await content.save({ transaction });
            }
            if (command.move < 0) {
                if (content.orderField + command.move < 1) {
                    await transaction.rollback();
                    return errorResponse(
                        { [index]: 'Invalid move property for given content' }
                    );
                }

                await db.Content.update(
                    { orderField: db.sequelize.literal(`orderField + 1`) }, {
                        transaction,
                        where: {
                            parentId: content.parentId,
                            rootCategoryId: content.rootCategoryId,
                            orderField: {
                                [Op.gte]: content.orderField + command.move,
                                [Op.lt]: content.orderField,
                            }
                        }
                    }
                );

                content.orderField += command.move;
                await content.save({ transaction });
            }
        }
        if (command.name === 'display') {
            content.display = command.state;
            await content.save({ transaction });
        }
    }

    await transaction.commit();

    return new Response({ status: 'ok' }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}