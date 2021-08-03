import { ApolloServer } from "apollo-server";
import { context } from "./context";
import { schema } from "./schema/schema";
var server = new ApolloServer({ schema: schema, context: context });
server.listen().then(function (_a) {
  var url = _a.url;
  console.log("Apollo Server ready at " + url);
});
//# sourceMappingURL=server.js.map
