import "../css/About.css";
import React from "react";
import {
  Divider,
  Container,
  Grid,
  Header,
  Image,
  Segment,
  Icon,
  Card
} from "semantic-ui-react";
// import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default About => {
  return (
    <div className="aboutBody">
      <Navbar />

      <Segment className="statementSection" vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Divider className="ourTeam" horizontal>
                <Header className="teamHeader" as="h2">
                  Reduce Costs
                </Header>
              </Divider>
              <p className="teamHeader stateText">
                Harnessing Machine Learning for Shelf Life Determination
              </p>
              <p className="teamHeader stateText">
                Utilizing Historical Data for Predictive Maintenance
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment className="marketingSection" inverted vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row />
          <Grid.Row>
            <Grid.Column width={6}>
              <Header className="teamHeader marketText" as="h3">
                Intuitive Platform for All Users
              </Header>
              <p className="teamHeader">
                A Cloud Solution for a centralized platform to monitor a
                multi-refinery ecosystem and perform predicted maintenance on
                its machinery.
              </p>
            </Grid.Column>
            <Grid.Column floated="right" width={6}>
              <Header className="teamHeader marketText" as="h3">
                Agile, Effective, Scalable
              </Header>
              <p className="teamHeader">
                A centralized platform will in turn let them not just monitor
                the live status of their refineries but also make insightful
                decisions based on advanced analytics.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment className="ourTeamSection" vertical>
        <Container text>
          <Grid.Column width={2}>
            <Divider className="ourTeam" horizontal>
              <Header className="teamHeader" as="h2">
                Our Team
              </Header>
            </Divider>
          </Grid.Column>
          <br />
        </Container>

        <Container>
          <Grid.Row>
            <Card.Group>
              <Card>
                <Image src={require("../img/rohit.jpeg")} />
                <Card.Content>
                  <Card.Header>Rohit Kurhekar</Card.Header>
                  <Card.Meta>
                    <span className="date">Solution Engineer</span>
                  </Card.Meta>
                  <Card.Description>
                    <a href="https://github.com/rkane2342">
                      <Icon size="large" color="black" name="github" />
                    </a>
                    <a href="https://www.linkedin.com/in/rohit-kurhekar-5b627779/">
                      <Icon size="large" color="black" name="linkedin" />
                    </a>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Image src={require("../img/jason.png")} />
                <Card.Content>
                  <Card.Header>Jason McLaughlin</Card.Header>
                  <Card.Meta>
                    <span className="date">Solution Engineer</span>
                  </Card.Meta>
                  <Card.Description>
                    <a href="https://github.com/ranched">
                      <Icon size="large" color="black" name="github" />
                    </a>
                    <a href="https://www.linkedin.com/in/jason-s-mclaughlin/">
                      <Icon size="large" color="black" name="linkedin" />
                    </a>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Image src={require("../img/sammi.png")} />
                <Card.Content>
                  <Card.Header>Salman Rana</Card.Header>
                  <Card.Meta>
                    <span className="date">Solution Engineer</span>
                  </Card.Meta>
                  <Card.Description>
                    <a href="https://github.com/salmanrrana">
                      <Icon size="large" color="black" name="github" />
                    </a>
                    <a href="https://www.linkedin.com/in/salmanrrana/">
                      <Icon size="large" color="black" name="linkedin" />
                    </a>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Image src={require("../img/chris.jpeg")} />
                <Card.Content>
                  <Card.Header>Chris Kelley</Card.Header>
                  <Card.Meta>
                    <span className="date">Solution Engineer</span>
                  </Card.Meta>
                  <Card.Description>
                    <a href="https://github.com/Kelleyc718">
                      <Icon size="large" color="black" name="github" />
                    </a>
                    <a href="https://www.linkedin.com/in/chrisdkelley/">
                      <Icon size="large" color="black" name="linkedin" />
                    </a>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Image src={require("../img/mark.jpeg")} />
                <Card.Content>
                  <Card.Header>Mark Smith</Card.Header>
                  <Card.Meta>
                    <span className="date">Solution Engineer</span>
                  </Card.Meta>
                  <Card.Description>
                    <a href="https://www.linkedin.com/in/markwilsmith/">
                      <Icon size="large" color="black" name="linkedin" />
                    </a>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Row>
        </Container>
      </Segment>

      <Segment id="about" inverted vertical />
    </div>
  );
};
