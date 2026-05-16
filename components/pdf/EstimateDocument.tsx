// components/pdf/EstimateDocument.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register standard fonts to ensure PDF renders identically across all devices
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFUfAZ9hiA.woff2",
      fontWeight: 900,
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Inter", backgroundColor: "#ffffff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
    paddingBottom: 20,
    marginBottom: 30,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
    textTransform: "uppercase",
  },
  metaBox: { alignItems: "flex-end" },
  metaLabel: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: { fontSize: 10, fontWeight: 700, color: "#0f172a" },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 900,
    color: "#2563eb",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 1,
  },

  gridRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 8,
  },
  gridLabel: { width: "40%", fontSize: 10, color: "#64748b" },
  gridValue: { width: "60%", fontSize: 10, fontWeight: 700, color: "#0f172a" },

  pricingContainer: {
    marginTop: 30,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  tierTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  tierDesc: { fontSize: 10, color: "#64748b", marginBottom: 12 },
  tierPrice: { fontSize: 24, fontWeight: 900, color: "#2563eb" },

  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disclaimer: { fontSize: 8, color: "#94a3b8", width: "70%", lineHeight: 1.4 },
  pageNumber: { fontSize: 8, color: "#94a3b8" },
});

interface EstimateDocumentProps {
  consumerName: string;
  projectType: string;
  date: string;
  aiSpecs: Record<string, string>;
  estimatedValue: number;
}

export default function EstimateDocument({
  consumerName,
  projectType,
  date,
  aiSpecs,
  estimatedValue,
}: EstimateDocumentProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>BUILDRAIL</Text>
            <Text style={styles.brandSub}>Automated Project Estimation</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Prepared For</Text>
            <Text style={styles.metaValue}>{consumerName}</Text>
            <Text style={[styles.metaLabel, { marginTop: 8 }]}>
              Date Generated
            </Text>
            <Text style={styles.metaValue}>{date}</Text>
          </View>
        </View>

        {/* PROJECT SCOPE SECTION */}
        <Text style={styles.sectionTitle}>
          Calculated Project Scope: {projectType}
        </Text>
        <View style={{ marginBottom: 20 }}>
          {Object.entries(aiSpecs).map(([key, value]) => (
            <View key={key} style={styles.gridRow}>
              <Text style={styles.gridLabel}>{key}</Text>
              <Text style={styles.gridValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* PRICING BLOCK */}
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.pricingContainer}>
          <Text style={styles.tierTitle}>Standard Scope Projection</Text>
          <Text style={styles.tierDesc}>
            Includes estimated baseline materials, labor overhead, and standard
            permits.
          </Text>
          <Text style={styles.tierPrice}>
            ${estimatedValue.toLocaleString()}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            This document was generated algorithmically based on user inputs and
            regional data models. All figures are estimates only and do not
            constitute a binding legal contract. A final on-site inspection is
            required.
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
