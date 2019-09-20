const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require("@babel/types");
const core = require("@babel/core");

module.exports = function (content, map, meta) {
	
	let ast = parser.parse(content);
	
    traverse(ast, {
        AwaitExpression(path) {
            if (path.node.done) {
                return;
            }
            path.node.done = true;

            if (path.findParent(path => t.isTryStatement(path.node))) {
                return;
			}
			
            // 变量声明的方式 let f = await fun()
            if (t.isVariableDeclarator(path.parent)) {
                // 拆成await 表达式
                let expression = t.assignmentExpression(
                    '=',
                    t.identifier(path.parent.id.name),
                    path.node
                );

                let tryCatchAst = t.tryStatement(
                    t.blockStatement([t.expressionStatement(expression)]),
                    t.catchClause(
                        t.identifier('e'),
                        t.blockStatement(parser.parse('console.log(e)').program.body)
                    ),
                );

                path.parentPath.parentPath.insertAfter(tryCatchAst);
                path.replaceWith(t.stringLiteral(''))
            } else if (t.isAssignmentExpression(path.parent)) {
                // 赋值的方式  f = await fun()
                let tryCatchAst = t.tryStatement(
                    t.blockStatement([path.parentPath.parentPath.node]),
                    t.catchClause(
                        t.identifier('e'),
                        t.blockStatement(parser.parse('console.log(e)').program.body)
                    ),
                );

                path.parentPath.parentPath.replaceWithMultiple([tryCatchAst]);
            } else {
                // 表达式  await fun()
                let tryCatchAst = t.tryStatement(
                    t.blockStatement([t.expressionStatement(path.node)]),
                    t.catchClause(
                        t.identifier('e'),
                        t.blockStatement(parser.parse('console.log(e)').program.body)
                    ),
                );
                path.replaceWithMultiple([tryCatchAst]);
            }
        }
	});
	
    console.log('=========', core.transformFromAstSync(ast).code);
    return core.transformFromAstSync(ast).code;
}
