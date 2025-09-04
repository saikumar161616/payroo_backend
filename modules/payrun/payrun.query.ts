import { create } from "domain";
import mongoose from "mongoose";

class PayrunQuery {
    constructor() { }

    getTimesheetQuery(matchQuery: any) {
        return [
            {
                $match: {
                    employeeId: matchQuery.employeeId,
                    periodStart: { $lte: new Date(matchQuery.periodStart) },
                    periodEnd: { $gte: new Date(matchQuery.periodEnd) },
                }
            },
            {
                $project: {
                    _id: 1,
                    employeeId: 1,
                    periodStart: 1,
                    periodEnd: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    entries: {
                        $filter: {
                            input: "$entries",
                            as: "entry",
                            cond: {
                                $and: [
                                    { $gte: ["$$entry.date", new Date(matchQuery.periodStart)] },
                                    { $lte: ["$$entry.date", new Date(matchQuery.periodEnd)] }
                                ]
                            }
                        }
                    },
                }
            }
        ]
    }
}

export default new PayrunQuery();