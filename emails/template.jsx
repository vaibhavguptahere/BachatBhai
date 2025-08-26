import {
    Html,
    Head,
    Preview,
    Body,
    Heading,
    Container,
    Text,
    Section,
} from "@react-email/components";
import * as React from "react";

// Currency formatter for INR
const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value));
};

export default function EmailTemplate({
    userName = "",
    type = "monthly-report",
    data = {},
}) {
    if (type === "monthly-report") {
        return (
            <Html>
                <Head />
                <Preview>Your Monthly Financial Report</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.title}>Monthly Financial Report</Heading>

                        <Text style={styles.text}>Hello {userName},</Text>
                        <Text style={styles.text}>
                            Here&rsquo;s your financial summary for {data?.month}:
                        </Text>

                        {/* Main Stats */}
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Income</Text>
                                <Text style={styles.value}>
                                    {formatCurrency(data?.stats?.totalIncome?.toFixed(2))}
                                </Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Expenses</Text>
                                <Text style={styles.value}>
                                    {formatCurrency(data?.stats?.totalExpenses?.toFixed(2))}
                                </Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Net</Text>
                                <Text style={styles.value}>
                                    {formatCurrency(
                                        Number(data?.stats?.totalIncome?.toFixed(2) || 0) -
                                        Number(data?.stats?.totalExpenses?.toFixed(2) || 0)
                                    )}
                                </Text>
                            </div>
                        </Section>

                        {/* Category Breakdown */}
                        {data?.stats?.byCategory &&
                            Object.keys(data?.stats?.byCategory).length > 0 && (
                                <Section style={styles.section}>
                                    <Heading style={styles.sectionHeading}>
                                        Expenses by Category
                                    </Heading>
                                    {Object.entries(data?.stats.byCategory).map(
                                        ([category, amount]) => (
                                            <div key={category} style={styles.row}>
                                                <Text style={styles.text}>{category}</Text>
                                                <Text style={styles.value}>
                                                    {formatCurrency(amount)}
                                                </Text>
                                            </div>
                                        )
                                    )}
                                </Section>
                            )}

                        {/* AI Insights */}
                        {data?.insights && data.insights.length > 0 && (
                            <Section style={styles.section}>
                                <Heading style={styles.sectionHeading}>
                                    BaChatBhai Insights
                                </Heading>
                                {data.insights.map((insight, index) => (
                                    <Text key={index} style={styles.text}>
                                        • {insight}
                                    </Text>
                                ))}
                            </Section>
                        )}

                        <Text style={styles.footer}>
                            Thank you for using BaChatBhai. Keep tracking your finances for
                            better financial health!
                        </Text>
                    </Container>
                </Body>
            </Html>
        );
    }

    if (type === "budget-alert") {
        return (
            <Html>
                <Head />
                <Preview>Budget Alert</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.title}>Budget Alert</Heading>
                        <Text style={styles.text}>Hello {userName},</Text>
                        <Text style={styles.text}>
                            You&rsquo;ve used {data?.percentageUsed?.toFixed(1)}% of your
                            monthly budget.
                        </Text>
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Budget Amount</Text>
                                <Text style={styles.value}>
                                    {formatCurrency(data?.budgetAmount?.toFixed(2))}
                                </Text>
                            </div>

                            <div style={styles.stat}>
                                <Text style={styles.text}>Spent So Far</Text>
                                <Text style={styles.value}>
                                    {formatCurrency(data?.totalExpenses?.toFixed(2))}
                                </Text>
                            </div>

                            <div style={styles.stat}>
                                <Text style={styles.text}>Remaining</Text>
                                <Text style={styles.value}>
                                    {formatCurrency(
                                        Number(data?.budgetAmount?.toFixed(2) || 0) -
                                        Number(data?.totalExpenses?.toFixed(2) || 0)
                                    )}
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Html>
        );
    }

    return null;
}

const styles = {
    body: {
        backgroundColor: "#f6f9fc",
        fontFamily: "-apple-system, sans-serif",
    },
    container: {
        backgroundColor: "#ffffff",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title: {
        color: "#1f2937",
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        margin: "0 0 20px",
    },
    sectionHeading: {
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 16px",
    },
    text: {
        color: "#4b5563",
        fontSize: "16px",
        margin: "0 0 16px",
    },
    statsContainer: {
        margin: "32px 0",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
    },
    stat: {
        marginBottom: "16px",
        padding: "12px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
    },
    value: {
        color: "#111827",
        fontSize: "18px",
        fontWeight: "700",
        margin: "0 0 12px",
    },
    footer: {
        color: "#6b7280",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "32px",
        paddingTop: "16px",
        borderTop: "1px solid #e5e7eb",
    },
};
