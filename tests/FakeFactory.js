const { faker } = require('@faker-js/faker');

class FakeFactory {
    constructor() {
        this.faker = faker;
    }

    createFakeAcc = ({id, login, email, role, operator, client}) => {
        let fakeAccount = {
            id: id || null,
            login: (login === undefined) ? faker.internet.userName() : login,
            hash: faker.internet.password(),
            email: (email === undefined) ? faker.internet.email() : email,
            RoleId: role || 4,
            OperatorId: operator || null,
            ClientId: client || null,
        };
        return fakeAccount;
    }

    createFakeAddress = ({id, city, postcode, street, home_number, client}) => {
        let fakeAddress = {
            id: id || null,
            city: city || faker.location.city(),
            postcode: postcode || faker.location.zipCode(),
            street: street || faker.location.street(),
            home_number: home_number || faker.location.buildingNumber(),
            ClientId: client || null,
        };
        return fakeAddress;
    };

    createFakeClient = ({id, firstName, lastName, phone}) => {
        let fakeClient = {
            id: id || null,
            firstname: firstName || faker.person.firstName(),
            lastName: lastName || faker.person.lastName(),
            phone: phone || faker.phone.number(),
        };
        return fakeClient;
    };

    createFakeOperator = ({id, firstName, lastName, phone, license, city, operational_range, description}) => {
        let fakeOperator = {
            id: id || null,
            firstname: firstName || faker.person.firstName(),
            lastName: lastName || faker.person.lastName(),
            phone: phone || faker.phone.number(),
            license: license || faker.lorem.word(),
            city: city || faker.location.city(),
            operational_range: operational_range || faker.number.int({min: 10, max: 2000}),
            description: description || faker.lorem.paragraphs(1)
        }
        return fakeOperator;
    };

    createFakeCommission = ({id, title, description, city, startDate, endDate, completed, payment, author, contractor}) => {
        let fakeCommission = {
            id: id || null,
            title: title || faker.lorem.words(5),
            description: description || faker.lorem.paragraph(),
            city: city || faker.location.city(),
            start_date: startDate || faker.date.recent(),
            end_date: endDate || faker.date.future(),
            completed: completed || false,
            payment: payment || faker.number.int({max: 30000}),
            author: author || 1,
            contractor: contractor || 1
        }
        return fakeCommission;
    };
};

module.exports = FakeFactory