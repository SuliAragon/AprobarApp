export const b3t7ArchitectureReferences = {
  fallback: "Arquitectura de servicios web y protocolos asociados",
  rules: [
    [/hexagonal|puerto|adaptador|dominio|inversi.n.*dependencias/i, "8. Arquitectura hexagonal"],
    [/OpenAPI|Swagger|RAML|WADL|API Blueprint/i, "6.4. Especificacion de APIs: OpenAPI"],
    [/OAuth|JWT|token|Bearer/i, "6.2-6.3. OAuth 2.0 y JWT"],
    [/Axis2|CXF|Jersey|RESTEasy|gSOAP|WCF|SoapUI|Postman/i, "7. Frameworks"],
    [/WSDL|binding|interface|portType|one-way|solicit-response|request-response|notification/i, "5.4. WSDL: descripcion"],
    [/UDDI|WSIL|p.ginas blancas|p.ginas amarillas|p.ginas verdes|SAML|WS-Security|WS-Policy|MTOM|XOP|SOAP|Envelope|Header|Body|Fault/i, "5. Servicios web SOAP: arquitectura y tecnologias"],
    [/microservicio|API Gateway|BFF|RabbitMQ|Kafka|AMQP|br.ker|mensajer.a|publish.subscribe/i, "3. Arquitectura de microservicios"],
    [/REST|HTTP|URI|HATEOAS|idempotente|GET|POST|PUT|DELETE|PATCH|cach.|cache|c.digo bajo demanda/i, "6. Arquitectura REST y codigos de estado HTTP"],
    [/SOA|orquestaci.n|coreograf.a|contrato.*servicio|principio.*servicios|abstracci.n|autonom.a|acoplamiento/i, "2. Arquitectura orientada a servicios (SOA)"],
    [/cliente|capa|nivel|presentaci.n|negocio|datos|transparencia|escalabilidad|monolito/i, "1. Arquitecturas de sistemas cliente/servidor y multicapa"],
  ],
};
