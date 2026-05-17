import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", backgroundColor: "#ffffff" },

  title: {
    fontSize: 24,
    fontWeight: 900,
    textAlign: "center",
    marginBottom: 12,
    color: "#0f172a",
  },

  yellowBanner: {
    backgroundColor: "#facc15",
    padding: 8,
    textAlign: "center",
    marginBottom: 25,
  },
  bannerText: { fontSize: 10, color: "#0f172a", fontWeight: 700 },

  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  column: { width: "48%" },

  sectionHeading: {
    fontSize: 11,
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 6,
  },

  infoTable: { width: "100%" },
  infoRow: { flexDirection: "row" },
  infoLabelCell: {
    width: "35%",
    backgroundColor: "#0f172a",
    padding: 6,
    border: "1pt solid #0f172a",
  },
  infoLabelText: { fontSize: 9, color: "#ffffff", fontWeight: 700 },
  infoValueCell: {
    width: "65%",
    padding: 6,
    border: "1pt solid #cbd5e1",
    borderLeft: 0,
  },
  infoValueText: { fontSize: 9, color: "#0f172a" },

  descText: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: 25,
  },

  table: { width: "100%", border: "1pt solid #cbd5e1" },
  tableHeader: { flexDirection: "row", backgroundColor: "#0f172a" },
  th: {
    padding: 8,
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 700,
    borderRight: "1pt solid #cbd5e1",
  },

  tableRow: { flexDirection: "row", borderBottom: "1pt solid #cbd5e1" },
  td: {
    padding: 8,
    fontSize: 9,
    color: "#0f172a",
    borderRight: "1pt solid #cbd5e1",
  },

  totalRow: { flexDirection: "row", backgroundColor: "#facc15" },
  totalLabel: {
    padding: 8,
    fontSize: 10,
    fontWeight: 900,
    color: "#0f172a",
    textAlign: "right",
    borderRight: "1pt solid #eab308",
  },
  totalValue: {
    padding: 8,
    fontSize: 10,
    fontWeight: 900,
    color: "#0f172a",
    textAlign: "right",
  },
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
  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Deconstruct the total into realistic line items based on industry standards
  const demolition = estimatedValue * 0.15;
  const materials = estimatedValue * 0.35;
  const underlayment = estimatedValue * 0.1;
  const labor = estimatedValue * 0.25;
  const overhead = estimatedValue * 0.15;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Independent Contractor Estimate</Text>

        <View style={styles.yellowBanner}>
          <Text style={styles.bannerText}>
            BUILDRAIL ESTIMATION ENGINE | ALGORITHMIC PRICING MODEL
          </Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.column}>
            <Text style={styles.sectionHeading}>Client Information</Text>
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelCell}>
                  <Text style={styles.infoLabelText}>Name</Text>
                </View>
                <View style={styles.infoValueCell}>
                  <Text style={styles.infoValueText}>
                    {consumerName || "Pending"}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoLabelCell, { borderTop: 0 }]}>
                  <Text style={styles.infoLabelText}>Property</Text>
                </View>
                <View style={[styles.infoValueCell, { borderTop: 0 }]}>
                  <Text style={styles.infoValueText}>
                    {aiSpecs["Property Address"] || "Satellite Extracted"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionHeading}>Project Information</Text>
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelCell}>
                  <Text style={styles.infoLabelText}>Estimate No.</Text>
                </View>
                <View style={styles.infoValueCell}>
                  <Text style={styles.infoValueText}>
                    BR-{Math.floor(Math.random() * 90000) + 10000}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoLabelCell, { borderTop: 0 }]}>
                  <Text style={styles.infoLabelText}>Date</Text>
                </View>
                <View style={[styles.infoValueCell, { borderTop: 0 }]}>
                  <Text style={styles.infoValueText}>{date}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Project Scope Summary</Text>
        <Text style={styles.descText}>
          Algorithmic estimate for {projectType.toLowerCase()}, based on
          satellite-extracted parameters ({aiSpecs["Total Area"]} @{" "}
          {aiSpecs["Roof Pitch"]}). Scope includes removal of existing surface,
          structural inspection, installation of premium materials, and complete
          site cleanup.
        </Text>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: "45%" }]}>Description</Text>
            <Text style={[styles.th, { width: "20%" }]}>Quantity</Text>
            <Text
              style={[
                styles.th,
                { width: "35%", borderRight: 0, textAlign: "right" },
              ]}
            >
              Estimated Price (USD)
            </Text>
          </View>

          {/* Rows */}
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: "45%" }]}>
              Demolition & Tear-off
            </Text>
            <Text style={[styles.td, { width: "20%" }]}>1 job</Text>
            <Text
              style={[
                styles.td,
                { width: "35%", borderRight: 0, textAlign: "right" },
              ]}
            >
              {formatCurrency(demolition)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: "45%" }]}>
              Premium Materials & Shingles
            </Text>
            <Text style={[styles.td, { width: "20%" }]}>Calculated Area</Text>
            <Text
              style={[
                styles.td,
                { width: "35%", borderRight: 0, textAlign: "right" },
              ]}
            >
              {formatCurrency(materials)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: "45%" }]}>
              Underlayment & Flashing
            </Text>
            <Text style={[styles.td, { width: "20%" }]}>1 job</Text>
            <Text
              style={[
                styles.td,
                { width: "35%", borderRight: 0, textAlign: "right" },
              ]}
            >
              {formatCurrency(underlayment)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: "45%" }]}>
              Licensed Labor & Installation
            </Text>
            <Text style={[styles.td, { width: "20%" }]}>Turnkey</Text>
            <Text
              style={[
                styles.td,
                { width: "35%", borderRight: 0, textAlign: "right" },
              ]}
            >
              {formatCurrency(labor)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: "45%" }]}>
              Dumpsters, Permits & Cleanup
            </Text>
            <Text style={[styles.td, { width: "20%" }]}>1 job</Text>
            <Text
              style={[
                styles.td,
                { width: "35%", borderRight: 0, textAlign: "right" },
              ]}
            >
              {formatCurrency(overhead)}
            </Text>
          </View>

          {/* Totals */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { width: "65%" }]}>
              Total Estimated Cost
            </Text>
            <Text style={[styles.totalValue, { width: "35%" }]}>
              {formatCurrency(estimatedValue)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
