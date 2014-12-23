name := """itechart-testing"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  jdbc,
  "org.squeryl" % "squeryl_2.10" % "0.9.5-6",
  cache,
  ws
)
