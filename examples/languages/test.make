PACKAGE	 = package
VERSION	 = ` date "+%Y.%m%d%" `
RELEASE_DIR  = ..
RELEASE_FILE = $(PACKAGE)-$(VERSION)

# that won't understand these lines
ifneq (,)
This makefile requires GNU Make.
endif

# Notice that the variable LOGNAME comes from the environment in
# POSIX shells.
#
# target: all - Default target. Does nothing.
all:
	echo "Hello $(LOGNAME), nothing to do by default"
		# TODO sometimes: echo "Hello ${LOGNAME}, nothing to do by default"
	echo "Try 'make help'"

# target: help - Display callable targets.
help:
	egrep "^# target:" [Mm]akefile

# target: list - List source files
list:
	# Won't work. Each command is in separate shell
	@cd src
	ls

	# Correct, continuation of the same shell
	cd src; \
	ls

# target: dist - Make a release.
dist:
	tar -cf  $(RELEASE_DIR)/$(RELEASE_FILE) && \
	gzip -9  $(RELEASE_DIR)/$(RELEASE_FILE).tar

%.txt : %.html
	lynx -dump $< > $@


# This is an explicit suffix rule. It may be omitted on systems
# that handle simple rules like this automatically.
.c.o:
	$(CC) $(CFLAGS) -c $<

FRC:
.SUFFIXES: .c

.PHONY: clean depend