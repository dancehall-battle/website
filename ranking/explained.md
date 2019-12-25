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

<table class="tg">
  <tr>
    <th># months ago</th>
    <th >Points</th>
  </tr>
  <tr>
    <td>0</td>
    <td>18</td>
  </tr>
  <tr>
    <td>1</td>
    <td>17</td>
  </tr>
  <tr>
    <td>2</td>
    <td>16</td>
  </tr>
  <tr>
    <td>3</td>
    <td>13</td>
  </tr>
  <tr>
    <td>4</td>
    <td>12</td>
  </tr>
  <tr>
    <td>5</td>
    <td>11</td>
  </tr>
  <tr>
    <td>6</td>
    <td>8</td>
  </tr>
  <tr>
    <td>7</td>
    <td>7</td>
  </tr>
  <tr>
    <td>8</td>
    <td>6</td>
  </tr>
  <tr>
    <td>9</td>
    <td>3</td>
  </tr>
  <tr>
    <td>10</td>
    <td>2</td>
  </tr>
  <tr>
    <td>11</td>
    <td>1</td>
  </tr>
  <tr>
    <td>>= 12</td>
    <td>0</td>
  </tr>
</table>

The formula to calculate the total points $$points_d$$ for a dancer _d_ given a set of battles _B_ 
won by _d_ is

$$points_d = \sum_{i=0}^{|B|} pointsOfBattle(B_i)$$

$$pointsOfBattle(b) = diff(b_{date}, today)$$