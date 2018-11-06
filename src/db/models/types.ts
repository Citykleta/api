export interface ModelDefinition {
    table: string;
    columns: {
        [key: string]: string | Object;
    },
    relations: {
        [relationName: string]: Object
    }
}

export interface ModelServiceFactory {
    (def: any): ModelDefinition
}
