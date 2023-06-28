const db = require('../seqDB/models');
const FakeFactory = require('./FakeFactory');
const fakeFactory = new FakeFactory();

describe('Database tests', () => {
    let tables = Object.assign({}, db);
    delete tables.Sequelize;
    delete tables.sequelize;
    tables = Object.values(tables);
    
    let account1, account2, role1, address1, client1, operator1, commission1;
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });

        try {
            role1 = await db.Role
            .create({id: 1, name: 'test_role'})

            client1 = await db.Client
            .create(fakeFactory.createFakeClient({id: 1}));

            operator1 = await db.Operator
            .create(fakeFactory.createFakeOperator({id: 1}));
            
            account1 = await db.Account
            .create(fakeFactory.createFakeAcc({id: 1,role: role1.id, operator: operator1.id}));

            account2 = await db.Account
            .create(fakeFactory.createFakeAcc({id: 2,role: role1.id, client: client1.id }));

            commission1 = await db.Commission
            .create(fakeFactory.createFakeCommission({id: 1, author: account2.id, contractor: account1.id}))

            address1 = await db.Address
            .create(fakeFactory.createFakeAddress({id: 1, client: client1.id}))


        } catch (err) {
            console.log(err);
        }
        
    });

    describe('Test Account table', () => {
        // Two accoiunts already exists with id 1, 2 and role 4
        test('id unique', async () => {
            await expect(async () => {
                await db.Account.create(fakeFactory.createFakeAcc({ id: account1.id }));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError)
            
        })
    
        test('login unique', async () => {
            await expect(async () => {
                await db.Account.create(fakeFactory.createFakeAcc({ login: account1.login, role: role1.id }));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError)
        })
    
        test('login not null', async () => {
            await expect(async () => {
                await db.Account.create(fakeFactory.createFakeAcc({ login: null }));
            }).rejects.toThrow(db.Sequelize.ValidationError)
        })
    
        test('email unique', async () => {
            await expect(async () => {
                await db.Account.create(fakeFactory.createFakeAcc({ email: account1.email }));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError)
        })
    
        test('email not null', async () => {
            await expect(async () => {
                await db.Account.create(fakeFactory.createFakeAcc({ email: null }));
            }).rejects.toThrow(db.Sequelize.ValidationError)
        })
        
        test('should accept only existing OperatorId', async () => {
            await expect(async () => {
                const acc1 = await db.Account.create(fakeFactory.createFakeAcc({ operator: 2}));
            }).rejects.toThrow(db.Sequelize.ForeignKeyConstraintError)
        })
    
        test('should accept only existing ClientId', async () => {
            await expect(async () => {
                const acc1 = await db.Account.create(fakeFactory.createFakeAcc({ client: 2}));
            }).rejects.toThrow(db.Sequelize.ForeignKeyConstraintError)
        })
    
        test('should accepts only existing RoleId', async () => {
            await expect(async () => {
                const acc1 = await db.Account.create(fakeFactory.createFakeAcc({ role: 3 }))
            }).rejects.toThrow(db.Sequelize.ForeignKeyConstraintError);
        })
    })
    
    describe('Test Client table', () => {
        // One client already exists with id = 1
        test('unique id', async () => {
            await expect(async () => {
                await db.Client
                .create(fakeFactory.createFakeClient({id: 1}));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError);
        })
    })

    describe('Test Operator table', () => {
        // One operator already exists with id = 1
        test('unique id', async () => {
            await expect(async () => {
                await db.Operator
                .create(fakeFactory.createFakeOperator({id: 1}));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError);
        })
    })

    describe('Test Role table', () => {
        // One role already exists and it has id 1 and name 'test_role'
        test('unique id', async () => {
            await expect(async () => {
                await db.Role.create({id: 1, name: 'test_role_name'});
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError);
        })

        test('unique name', async () => {
            await expect(async () => {
                await db.Role.create({id: 2, name: 'test_role'});
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError);
        })

        test('names not null', async () => {
            await expect(async () => {
                await db.Role.create({id: 2, name: null});
            }).rejects.toThrow(db.Sequelize.ValidationError)
        })
    })

    describe('Test Address table', () => {
        // One address already exists with id 1 and ClientId 1
        test('unique id', async () => {
            await expect(async () => {
                await db.Address
                .create(fakeFactory.createFakeAddress({id: 1, client: client1.id}));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError);
        })

        test('unique ClientId', async () => {
            await expect(async () => {
                await db.Address
                .create(fakeFactory.createFakeAddress({id: 2, client: client1.id}));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError);
        })
        test('ClientId not null', async () => {
            await expect(async () => {
                await address1.update({ClientId: null});
            }).rejects.toThrow(db.Sequelize.ValidationError);
        })
    })

    describe('Test Commission table', () => {
        // One commission already exists with id = 1 and author = 2 and contractor = 1
        test('unique id', async () => {
            await expect(async () => {
                await db.Commission
                .create(fakeFactory.createFakeCommission({id: 1}));
            }).rejects.toThrow(db.Sequelize.UniqueConstraintError);
        })

        test('author not null', async () => {
            await expect(async () => {
                await db.Commission
                .update(
                    {author: null},
                    {where: { id: 1 }}
                )
            }).rejects.toThrow(db.Sequelize.ValidationError);
        })
    })

    
    
    afterAll(async () => {
        // Clearing all tables
        tables.forEach(table => table.destroy({where : {}, truncate : true}))

        // Clearing sequence
        await db.sequelize.query('DELETE FROM sqlite_sequence');
        // Closing connection
        await db.sequelize.close();
    });
})

