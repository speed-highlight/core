#!/usr/bin/perl

use strict;
use warnings;

# This would print with a line break in the middle
print "Hello
			world\n";
$a = 10;
print "Value of a = $a\n";

$var = <<'EOF';

my ( $remaining, $total );

$remaining = $total = shift(@ARGV);

STDOUT->autoflush(1);

while ( $remaining ) {
	printf ( "Remaining %s/%s \r", $remaining--, $total );
	sleep 1;
}

print "\n";