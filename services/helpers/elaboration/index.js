const { Elaboration } = require('../../database/models');


const createElaboration = async (procedure, message = "", state = 'N', parent_id = null) => {
  return Elaboration.query()
    .insert({
      procedure,
      message,
      state,
      start: new Date(),
      parent_id
    });
}

const getElaboration = async (id) => {
  return Elaboration.query()
    .findById(id);
}


const getElaborationByProcedure = async (procedure) => {
  return await Elaboration.query()
    .where('procedure', procedure)
    .orderBy('id', 'DESC')
    .first();
}


const endElaboration = async (id, return_code) => {
  await Elaboration.query()
    .findById(id)
    .patch({
      end: new Date(),
      return_code
    });
  return await getElaboration(id);
}


const addElaboration = async (procedure, message) => {
  const existingElaboration = await getElaborationByProcedure(procedure);
  if(existingElaboration) {
    if(!existingElaboration.end) {
      throw new Error(existingElaboration.message);
    }
    if(existingElaboration.return_code !== 0) {
      return createElaboration(procedure, message, 'R', existingElaboration.id);
    }
  }
  return createElaboration(procedure, message);
}

module.exports = {
  addElaboration,
  endElaboration,
  getElaboration,
  getElaborationByProcedure
};