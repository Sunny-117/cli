// mtc demo
const program = require('commander')
const path = require('path')

const commandLists = [{
    name: 'create',
    type: '<ProjectName>',
    alias: 'c',
}]

for (const p of commandLists) {
    let actions = require(path.resolve(__dirname, `./actions/${p.name}`))
    program.command(p.name)
        .argument(p.type)
        .alias(p.alias)
        .action(
            actions
        )
}

program.parse(process.argv)
