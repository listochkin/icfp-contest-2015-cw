for i in {0..23}
do
  u="http://icfpcontest.org/problems/problem_$i.json"
  f="./problems/problem_$i.json"
  curl $u > $f
done
