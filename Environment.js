class Environment {
    constructor () {
        this.scope = globalThis;
    }

    run (expression) {
        return this.scope.eval(expression);
    }

    getGlobalVariables () {
        const globalVariablesNames = Object.keys(this.scope).slice(8).sort();
        const globalVariables = {};
        for (let globalVariableName of globalVariablesNames) {
            globalVariables[globalVariableName] = this.scope[globalVariableName];
        }
        return globalVariables;
    }
}

module.exports = Environment