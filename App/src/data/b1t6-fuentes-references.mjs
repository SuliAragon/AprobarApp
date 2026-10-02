export const b1t6FuentesReferences = {
  fallback: "Fuentes del Derecho Administrativo y jerarquia de las fuentes",
  rules: [
    [/Uni.n Europea|comunitari|directiva|dict.men|recomendaci.n|TFUE/i, "Otras fuentes: Derecho de la Union Europea"],
    [/tratado|convenio|organizaci.n.*internacional/i, "Los tratados internacionales"],
    [/art.*150|leyes marco|armonizaci.n|transferencia/i, "La Ley: leyes del articulo 150 CE"],
    [/decreto.?ley|urgente necesidad|convalidaci.n/i, "Disposiciones del ejecutivo con fuerza de ley: Decreto-Ley"],
    [/decreto.*legislativo|delegaci.n legislativa|ley de bases|leyes de bases|refundido|articulado|subdeleg/i, "Disposiciones del ejecutivo con fuerza de ley: Decreto Legislativo"],
    [/reglamento|reglamentaria|orden ministerial|real decreto/i, "El Reglamento: concepto, clases y limites"],
    [/jerarqu.a|competencia|supletori|prevalencia|rango|norma superior/i, "La jerarquia de las fuentes"],
    [/costumbre|principios generales|jurisprudencia|doctrina|fuente indirecta/i, "Otras fuentes: costumbre, principios generales y jurisprudencia"],
    [/ley|leyes|iniciativa|sanci.n|sindicaci.n|nacionalidad|derechos|constitucionalidad|Asamblea/i, "La Ley: clases y procedimiento legislativo"],
  ],
};
