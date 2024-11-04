"use strict";
const isCpfValido = require("../../utils/validaCpfHelper.js");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasMany(models.Curso, {
        foreignKey: "docente_id",
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: "estudante_id",
        scope: { status: "matriculado" },
        as: "aulasMatriculadas",
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: "estudante_id",
        as: "todasAsMatriculas",
      });
    }
  }
  Pessoa.init(
    {
      nome: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 30],
            msg: "O campo nome deve ter no mínimo 3 caracteres e no máximo 30.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          //validação para garantir que o campo e-mail informado seja realmente um e-mail
          isEmail: {
            args: true,
            msg: "Formato do e-mail inválido",
          },
        },
      },
      cpf: {
        type: DataTypes.STRING,
        validate: {
          //valida se o CPF possui 11 caracteres -- criado o ../../utils/validaCpfHelper.js
          cpfEhValido: (cpf) => {
            if (!isCpfValido(cpf)) throw new Error("Número de CPF inválido");
          },
        },
      },
      ativo: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pessoa",
      tableName: "pessoas",
      paranoid: true,
      defaultScope: {
        //escopo padrão para que as pessoas não ativas não sejam mostradas na busca/filtro
        where: {
          ativo: true,
        },
      },
      scopes: {
        //escopo nomeado para buscar tudo, sem efetuar o filtro anterior -- criado no ../services/Service.js o método pegaRegistrosPorEscopo e no ../services/PessoaServices.js o pegaPessoasEscopoTodos
        //em controllers/PessoaController.js adicionado o metódo pegaTodasAsPessoas e criado em route/pessoasRoute.js a rota pegaTodasAsPessoas
        todosOsRegistros: {
          where: {},
        },
      },
    }
  );
  return Pessoa;
};
