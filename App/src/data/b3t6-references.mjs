export const b3t6References = {
  fallback: "Jakarta EE y .NET: componentes, persistencia y seguridad",
  rules: [
    [/C\+\+|calificador const|inicializadores|friend|inline/i, "Resumen C++: funciones, clases y herencia"],
    [/C#|Csharp/i, "Resumen C#: tipos, clases e interfaces"],
    [/c.digo en C\b|puntero|printf/i, "Resumen C: arrays, punteros y funciones"],
    [/JPA|JDBC|EntityManager|JPQL|persistencia.*Java/i, "Jakarta EE: persistencia"],
    [/ADO\.NET|LINQ|Entity Framework|DataReader|DataSet|DbConnection/i, ".NET: persistencia y acceso a datos"],
    [/CLR|CTS|CLS|CIL|MSIL|ensamblado|BCL|NuGet|WPF|WCF|Blazor|MAUI|Xamarin|\.NET/i, ".NET: arquitectura, bibliotecas e interfaces"],
    [/servlet|JSP|EJB|JMS|JASPIC|Jakarta|Jena/i, "Jakarta EE: componentes y servicios"],
    [/Java|JRE|JDK|throws|abstract|final|static|SAX|StAX/i, "Resumen Java: clases, herencia y excepciones"],
  ],
};
