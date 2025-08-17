import { Html, Head, Preview, Body, Heading, Container, Text, Section } from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
    userName = "",
    type = "budget-alert",
    data = {
    },
}) {

    if (type === "monthly-report") {

    }

    if (type === "budget-alert") {
        return (
            <Html>
                <Head />
                <Preview>Budget Alert</Preview>
                <Body style={Styles.body}>
                    <Container style={Styles.container}>
                        <Heading style={Styles.title}>
                            Budget Alert
                        </Heading>
                        <Text style={Styles.text}>
                            Hello {userName},
                        </Text>
                        <Text style={Styles.text}>
                            You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your monthly budget.
                        </Text>
                        <Section style={Styles.statsContainer}>
                            <div style={Styles.stat}>
                                <Text style={Styles.text}>
                                    Budget Amount
                                </Text>
                                <Text style={Styles.heading}>
                                    Rs. {data?.budgetAmount}
                                </Text>
                            </div>

                            <div style={Styles.stat}>
                                <Text style={Styles.text}>
                                    Spent So Far
                                </Text>
                                <Text style={Styles.heading}>
                                    Rs. {data?.totalExpenses}
                                </Text>
                            </div>

                            <div style={Styles.stat}>
                                <Text style={Styles.text}>
                                    Remaining
                                </Text>
                                <Text style={Styles.heading}>
                                    Rs. {data?.budgetAmount - data?.totalExpenses}
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Html>
        );
    }
}

const Styles = {
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

    heading: {
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
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    }
}