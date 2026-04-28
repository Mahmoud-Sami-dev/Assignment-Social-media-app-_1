"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
class AbstractRepository {
    _model;
    constructor(_model) {
        this._model = _model;
    }
    /**
     *
     * @param item is a generic data which passed to DB
     */
    async create(item) {
        const doc = new this._model(item); // ram
        return doc.save();
    }
    // filter >> _id or email, price, userId
    // projection >> email , password
    async getOne(filter, projection, options) {
        return this._model.findOne(filter, projection, options); // sort, skip, limit, populate
    }
    async getAll(filter, projection, options) {
        return this._model.find(filter, projection, options); // sort, skip, limit, populate
    }
    async updateOne(filter, update, options = {}) {
        options.returnDocument = "after";
        return this._model.findOneAndUpdate(filter, update, options);
    }
    async deleteOne(filter) {
        return this._model.deleteOne(filter);
    }
}
exports.AbstractRepository = AbstractRepository;
