// BDS embeds a Google Fonts @import in each component. System fonts keep the
// extension popup self-contained without changing component behavior.
module.exports = source => source.replace(/@import\s+url\([^)]*fonts\.googleapis\.com[^)]*\);?/g, '');
