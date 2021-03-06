﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SummerBreeze
{
    public class SummerBreezeEnums
    {
        public enum AutoGeneratedKeyType
        {
            //This entity does not have an autogenerated key. 
            //The client must set the key before adding the entity to the EntityManager
            None = 0,

            //This entity's key is an Identity column and is set by the backend database. 
            //Keys for new entities will be temporary until the entities are saved at which point the keys will be converted to their 'real' versions.
            Identity = 1,

            //This entity's key is generated by a KeyGenerator and is set by the backend database.
            //Keys for new entities will be temporary until the entities are saved at which point the keys will
            KeyGenerator = 2
        }

        public enum Validators
        { 
            required = 0,
            maxLength = 1
        }
    }
}
