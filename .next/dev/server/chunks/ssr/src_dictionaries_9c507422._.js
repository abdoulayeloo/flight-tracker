module.exports = [
"[project]/src/dictionaries/fr.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/src_dictionaries_fr_json_5cbd809d._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/dictionaries/fr.json (json)");
    });
});
}),
"[project]/src/dictionaries/en.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/src_dictionaries_en_json_fc502b95._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/dictionaries/en.json (json)");
    });
});
}),
];