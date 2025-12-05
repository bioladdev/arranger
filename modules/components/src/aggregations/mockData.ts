/**
 * Mock genomics data for Storybook stories
 */

export const specimenTypeBuckets = [
	{ key: 'Primary Tumor', doc_count: 1245 },
	{ key: 'Metastatic', doc_count: 432 },
	{ key: 'Normal', doc_count: 876 },
	{ key: 'Recurrent Tumor', doc_count: 234 },
	{ key: 'Xenograft', doc_count: 98 },
	{ key: 'Cell Line', doc_count: 156 },
	{ key: 'Organoid', doc_count: 45 },
];

export const fileTypeBuckets = [
	{ key: 'BAM', doc_count: 3456 },
	{ key: 'VCF', doc_count: 2890 },
	{ key: 'FASTQ', doc_count: 4521 },
	{ key: 'TSV', doc_count: 1234 },
	{ key: 'TBI', doc_count: 2890 },
	{ key: 'BAI', doc_count: 3456 },
	{ key: 'MAF', doc_count: 567 },
	{ key: 'BED', doc_count: 789 },
	{ key: 'BigWig', doc_count: 345 },
	{ key: 'GTF', doc_count: 234 },
];

export const vitalStatusBuckets = [
	{ key: 'Alive', doc_count: 8765 },
	{ key: 'Deceased', doc_count: 2345 },
	{ key: 'Unknown', doc_count: 456 },
];

export const geneSymbolBuckets = [
	{ key: 'TP53', doc_count: 5432 },
	{ key: 'BRCA1', doc_count: 3210 },
	{ key: 'BRCA2', doc_count: 2987 },
	{ key: 'EGFR', doc_count: 2765 },
	{ key: 'KRAS', doc_count: 2543 },
	{ key: 'PIK3CA', doc_count: 2234 },
	{ key: 'PTEN', doc_count: 1987 },
	{ key: 'APC', doc_count: 1654 },
	{ key: 'BRAF', doc_count: 1432 },
	{ key: 'NRAS', doc_count: 1298 },
	{ key: 'MYC', doc_count: 1154 },
	{ key: 'RB1', doc_count: 1043 },
];

export const diagnosisBuckets = [
	{ key: 'Adenocarcinoma', doc_count: 2345 },
	{ key: 'Squamous Cell Carcinoma', doc_count: 1876 },
	{ key: 'Ductal Carcinoma', doc_count: 1543 },
	{ key: 'Glioblastoma', doc_count: 987 },
	{ key: 'Melanoma', doc_count: 876 },
	{ key: 'Leukemia', doc_count: 765 },
	{ key: 'Lymphoma', doc_count: 654 },
];

export const primarySiteBuckets = [
	{ key: 'Lung', doc_count: 3456 },
	{ key: 'Breast', doc_count: 3123 },
	{ key: 'Prostate', doc_count: 2345 },
	{ key: 'Colorectal', doc_count: 1987 },
	{ key: 'Brain', doc_count: 1234 },
	{ key: 'Skin', doc_count: 1098 },
];

export const ageRangeBuckets = [
	{ key: '0-10', doc_count: 234 },
	{ key: '11-20', doc_count: 456 },
	{ key: '21-30', doc_count: 876 },
	{ key: '31-40', doc_count: 1234 },
	{ key: '41-50', doc_count: 2345 },
	{ key: '51-60', doc_count: 3456 },
	{ key: '61-70', doc_count: 2987 },
	{ key: '71-80', doc_count: 1654 },
	{ key: '81-90', doc_count: 543 },
	{ key: '90+', doc_count: 123 },
];

export const dataStrategyBuckets = [
	{ key: 'WGS', doc_count: 4567 },
	{ key: 'WXS', doc_count: 3456 },
	{ key: 'RNA-Seq', doc_count: 2987 },
	{ key: 'Targeted Sequencing', doc_count: 1876 },
	{ key: 'miRNA-Seq', doc_count: 987 },
];

export const emptyBuckets: any[] = [];
