#!/usr/bin/env perl
use strict;

use WWW::YouTube::Download;
use Data::Dumper;
use List::Util;

my @quality_preference = ( 84, 85, 22, 82, 83, 18, 37, 38 );
my $id = pop @ARGV;

$_ = WWW::YouTube::Download->new;

my @fmts = @{$_->get_fmt_list($id)};

my $dst_fmt;

foreach my $value (@quality_preference) {
    my $idx = List::Util::first { int($_) == int($value) } @fmts;
    if ( $idx ) {
        $dst_fmt = $idx;
        last;
    }
}

my $filename = "/tmp/$id.mp4";
$_->download($id, { filename => $filename, fmt => $dst_fmt });
print "$filename";
