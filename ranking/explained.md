---
layout: blogpost
title: How rankings are calculated
date: 2020-01-01
---

# How rankings are calculated

The model for the calculation of the Dancehall Battle Ranking (DBR) 
was developed over multiple months in the last part of 2019
during which time different algorithms were tested and discussed.
The main goal was to create an algorithm
that allows to rank different dancers and countries
across different events at different times at different locations.

In what follows we will explain six different types of rankings.
Three for dancers and three for countries:

- Dancer
- Dancer (1 vs 1)
- Dancer (2 vs 2)
- Country
- Country (home)
- Country (away)

## Dancer rankings

A dancer get points for every win in the past 12 months.
Wins that happened more than 12 months ago are not taking into account.
The points earned are lowered the longer the win has been.
For example, a dancer gets less points for a win from 6 months ago then
for a win from 2 months ago.
The points currently used can be found in the following table: