module.exports = (objetoParams) => {
  for (let propriedade in objetoParams) {
    if (/Id|id/.test(propriedade)) {
      //se em propriedade tiver a palavra Id ou id, segue o fluxo
      objetoParams[propriedade] = Number(objetoParams[propriedade]);
    }
  }
  return objetoParams;
};
