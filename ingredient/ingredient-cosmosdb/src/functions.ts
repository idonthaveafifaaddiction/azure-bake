import {BaseUtility, IngredientManager} from '@azbake/core'
import { CosmosDBManagementClient, CosmosDBManagementModels, CosmosDBManagementMappers } from "@azure/arm-cosmosdb";

export class CosmosUtility extends BaseUtility {

 
    public create_resource_name(): string {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);

        const name = util.create_resource_name("cosms", null, true);
        return name;
    }
    public async get_primary_key(name: string, rg: string | null = null) : Promise<string> {
     
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        let resource_group = rg || await util.resource_group()

        const client = new CosmosDBManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId);

        let response = await client.databaseAccounts.listKeys(resource_group, name)

        let key: string = ""
        if (response.primaryMasterKey)
        {
            key = response.primaryMasterKey || ""
        }
        return key
    }
    public async get_secondary_key(name: string, rg: string | null = null) : Promise<string> {
     
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        let resource_group = rg || await util.resource_group()

        const client = new CosmosDBManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId);

        let response = await client.databaseAccounts.listKeys(resource_group, name)

        let key: string = ""
        if (response.secondaryMasterKey)
        {
            key = response.secondaryMasterKey || ""
        }
        return key
    }

    public async get_primary_connectionstring(name: string, rg: string | null = null) : Promise<string> {
        
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        let resource_group = rg || await util.resource_group()
  
        const client = new CosmosDBManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId);
        let response = await client.databaseAccounts.listConnectionStrings(resource_group,name)

        let connectionString : string =""
        response.connectionStrings?.forEach( cs => 
            {
                if (cs.description == "PRIMARY CONNECTION STRING")
                {
                    let  connectionString = cs.connectionString
                }
               
            })

        return connectionString;
    }

    public async get_secondary_connectionstring(name: string, rg: string | null = null) : Promise<string> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        let resource_group = rg || await util.resource_group()
  
        const client = new CosmosDBManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId);
        let response = await client.databaseAccounts.listConnectionStrings(resource_group,name)

        let connectionString : string =""
        response.connectionStrings?.forEach( cs => 
            {
                if (cs.description == "SECONDARY CONNECTION STRING")
                {
                    let  connectionString = cs.connectionString
                }
               
            })

        return connectionString;
    }
}

